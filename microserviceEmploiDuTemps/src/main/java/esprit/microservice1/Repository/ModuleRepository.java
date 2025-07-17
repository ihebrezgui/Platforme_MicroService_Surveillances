package esprit.microservice1.Repository;


import esprit.microservice1.Entity.MyModule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ModuleRepository extends JpaRepository<MyModule,Long> {
}
