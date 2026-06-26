package com.app.web;

import com.app.entity.AvisosUsuario;
import com.app.repository.AvisosUsuarioRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/avisos_usuarios")
public class AvisosUsuarioController {

    private final AvisosUsuarioRepository repository;

    public AvisosUsuarioController(AvisosUsuarioRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<AvisosUsuario> list() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public AvisosUsuario get(@PathVariable Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new NotFoundException("AvisosUsuario " + id + " not found"));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AvisosUsuario create(@Valid @RequestBody AvisosUsuario body) {
        body.setId(null);
        return repository.save(body);
    }

    @PutMapping("/{id}")
    public AvisosUsuario update(@PathVariable Long id, @Valid @RequestBody AvisosUsuario body) {
        if (!repository.existsById(id)) {
            throw new NotFoundException("AvisosUsuario " + id + " not found");
        }
        body.setId(id);
        return repository.save(body);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        repository.deleteById(id);
    }
}
