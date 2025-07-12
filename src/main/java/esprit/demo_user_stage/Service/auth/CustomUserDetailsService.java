package esprit.demo_user_stage.Service.auth;

import esprit.demo_user_stage.Entity.User;
import esprit.demo_user_stage.Repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

   /* @Override
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
    }*/

    @Override
    public UserDetails loadUserByUsername(String matricule) throws UsernameNotFoundException {
        User user = userRepository.findByMatricule(matricule);
        if (user == null) {
            throw new UsernameNotFoundException("User not found with matricule: " + matricule);
        }
        return org.springframework.security.core.userdetails.User
                .withUsername(user.getMatricule())  // utiliser matricule ici
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


    public List<User> getAllUsers() {
        return userRepository.findAll();
    }



    public Long getUserIdByMatricule(String matricule) {
        User user = userRepository.findByMatricule(matricule);
        if (user != null) {
            return user.getId();
        }
        return null;
    }

    public String getUserRoleByMatricule(String matricule) {
        User user = userRepository.findByMatricule(matricule);
        if (user != null) {
            return user.getRole().name();
        }
        return null;
    }

    //get mail by matricule
    public String getMailByMatricule(String matricule) {
        User user = userRepository.findByMatricule(matricule);
        if (user != null) {
            return user.getEmail();
        }
        return null;
    }
    //get username by matricule
    public String getUsernameByMatricule(String matricule) {
        User user = userRepository.findByMatricule(matricule);
        if (user != null) {
            return user.getUsername();
        }
        return null;
    }

}
