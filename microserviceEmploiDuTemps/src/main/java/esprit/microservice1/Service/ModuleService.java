package esprit.microservice1.Service;


import esprit.microservice1.Entity.MyModule;
import esprit.microservice1.Repository.ModuleRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class ModuleService {

    private final ModuleRepository moduleRepository;

    public List<MyModule> getAllModules() {
        return moduleRepository.findAll();
    }



}
