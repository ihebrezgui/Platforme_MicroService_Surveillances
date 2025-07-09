package esprit.demo_user_stage.Service.auth;

import esprit.demo_user_stage.Entity.User;
import esprit.demo_user_stage.Repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username);
        if (user == null) {
            throw new UsernameNotFoundException("User not found");
        }
        String roleName = "ROLE_" + user.getRole().name();  // si enum
        return org.springframework.security.core.userdetails.User
                .withUsername(user.getUsername())
                .password(user.getPassword())
                .roles(user.getRole().name())
                .build();
    }

    public Long getUserIdByUsername(String username) {
        User user = userRepository.findByUsername(username);  // Récupérer l'utilisateur depuis la base de données
        if (user != null) {
            return user.getId();  // Retourner l'ID de l'utilisateur
        }
        return null;
    }
    public String getUserRoleByUsername(String username) {
        User user = userRepository.findByUsername(username);  // Récupérer l'utilisateur depuis la base de données
        if (user != null) {
            return user.getRole().name();  // Retourner l'ID de l'utilisateur
        }
        return null;
    }

    //get users by id
    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }



    //get users by matricule
    public User getUserByMatricule(String matricule) {
    return userRepository.findByMatricule(matricule);
    }
}
