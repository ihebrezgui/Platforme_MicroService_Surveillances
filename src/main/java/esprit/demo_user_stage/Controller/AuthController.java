package esprit.demo_user_stage.Controller;

import esprit.demo_user_stage.Entity.User;
import esprit.demo_user_stage.Entity.UserDTO;
import esprit.demo_user_stage.Repository.UserRepository;
import esprit.demo_user_stage.Service.auth.CustomUserDetailsService;
import esprit.demo_user_stage.Service.auth.JwtUtils;
import esprit.demo_user_stage.Service.auth.MailService;
import esprit.demo_user_stage.Service.auth.PasswordResetTokenService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;


@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

    @Autowired
    private CustomUserDetailsService userService;

    private AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;

    private final PasswordResetTokenService tokenService;
    private final MailService mailService;

    @Autowired
    public AuthController(PasswordEncoder passwordEncoder, UserRepository userRepository,
                          AuthenticationManager authenticationManager, CustomUserDetailsService userService, PasswordResetTokenService tokenService, MailService mailService) {
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
        this.authenticationManager = authenticationManager;
        this.userService = userService;
        this.tokenService = tokenService;
        this.mailService = mailService;// Injection correcte
    }

    @ResponseBody
    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> registerUser(@RequestBody User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
        Map<String, String> response = new HashMap<>();

        response.put("message", "user registered successfully");
        return ResponseEntity.ok(response);
    }

   /* @PostMapping("/login")
    public ResponseEntity<UserDTO> authenticate(@RequestBody User user) {
        System.out.println("Tentative de connexion pour l'utilisateur : " + user.getUsername());

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword()));
        } catch (Exception e) {
            System.out.println("Échec de l'authentification : " + e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }

        String token = JwtUtils.generateToken(user.getUsername());

        // ➕ Injecter dans le contexte Spring Security
        Authentication authentication = new UsernamePasswordAuthenticationToken(
                user.getUsername(),
                token, // credentials
                null
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Récupérer l'ID de l'utilisateur depuis la base de données ou le service utilisateur
        Long userId = userService.getUserIdByUsername(user.getUsername());
        String role = userService.getUserRoleByUsername(user.getUsername());

        UserDTO userDTO = new UserDTO();
        userDTO.setUsername(user.getUsername());
        userDTO.setToken(token);
        userDTO.setId(userId);
        userDTO.setRole(role);


        return ResponseEntity.ok(userDTO);
    }
*/

    @PostMapping("/login")
    public ResponseEntity<UserDTO> authenticate(@RequestBody Map<String, String> loginRequest) {
        String matricule = loginRequest.get("matricule");
        String password = loginRequest.get("password");

        System.out.println("Tentative de connexion pour matricule : " + matricule);

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(matricule, password));
        } catch (Exception e) {
            System.out.println("Échec de l'authentification : " + e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }

        String token = JwtUtils.generateToken(matricule);

        Authentication authentication = new UsernamePasswordAuthenticationToken(
                matricule,
                token, // credentials
                null
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);

        Long userId = userService.getUserIdByMatricule(matricule);
        String role = userService.getUserRoleByMatricule(matricule);
        String email = userService.getMailByMatricule(matricule);
        String username = userService.getUsernameByMatricule(matricule);


        UserDTO userDTO = new UserDTO();
        userDTO.setMatricule(matricule);
        userDTO.setToken(token);
        userDTO.setId(userId);
        userDTO.setRole(role);
        userDTO.setEmail(email);
        userDTO.setUsername(username);


        return ResponseEntity.ok(userDTO);
    }

    @GetMapping("/me")
    public ResponseEntity<UserDetails> getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        UserDetails user = userService.loadUserByUsername(username);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/test")
    public String test() {
        return "message from backend successfully";
    }
    // Endpoint pour demander la réinitialisation du mot de passe

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody UserDTO request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Email non trouvé");
        }

        User user = userOpt.get();
        String token = JwtUtils.generateToken(user.getEmail());
        String resetLink = "http://localhost:4200/reset-password?token=" + token;

        String subject = "Réinitialisation de votre mot de passe";
        String message = "<p>Bonjour,</p>" +
                "<p>Vous avez demandé une réinitialisation de votre mot de passe.</p>" +
                "<p>Cliquez sur le lien ci-dessous pour le réinitialiser :</p>" +
                "<p><a href=\"" + resetLink + "\">Réinitialiser mon mot de passe</a></p>" +
                "<p>Si vous n'avez pas fait cette demande, ignorez cet email.</p>";

        try {
            mailService.sendEmail(user.getEmail(), subject, message);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erreur lors de l'envoi de l'email : " + e.getMessage());
        }

        return ResponseEntity.ok("Email de réinitialisation envoyé !");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestParam String token, @RequestBody User user) {
        String email = JwtUtils.extractUsername(token);
        if (email == null) {
            return ResponseEntity.badRequest().body("Token invalide ou expiré");
        }

        Optional<User> existingUserOpt = userRepository.findByEmail(email);
        if (existingUserOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Utilisateur non trouvé");
        }

        User existingUser = existingUserOpt.get();
        existingUser.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(existingUser);

        return ResponseEntity.ok("Mot de passe réinitialisé avec succès !");
    }

    @GetMapping("/{id}")
     public User getUserById(@PathVariable("id") Long id){
        return userService.getUserById(id);
    }

    @GetMapping("/matricule/{matricule}")
    public User getUserByMatricule(@PathVariable String matricule) {
        return userService.getUserByMatricule(matricule);
    }

    @GetMapping("/all")
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

  
}