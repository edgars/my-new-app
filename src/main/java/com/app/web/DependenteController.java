package com.app.web;

import com.app.entity.Dependente;
import com.app.repository.DependenteRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/dependentes")
public class DependenteController {

    private final DependenteRepository repository;

    public DependenteController(DependenteRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Dependente> list() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public Dependente get(@PathVariable Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Dependente " + id + " not found"));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Dependente create(@Valid @RequestBody Dependente body) {
        body.setId(null);
        return repository.save(body);
    }

    @PutMapping("/{id}")
    public Dependente update(@PathVariable Long id, @Valid @RequestBody Dependente body) {
        if (!repository.existsById(id)) {
            throw new NotFoundException("Dependente " + id + " not found");
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
