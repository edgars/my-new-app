package com.app.web;

import com.app.entity.Funcionario;
import com.app.repository.FuncionarioRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/funcionarios")
public class FuncionarioController {

    private final FuncionarioRepository repository;

    public FuncionarioController(FuncionarioRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Funcionario> list() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public Funcionario get(@PathVariable Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Funcionario " + id + " not found"));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Funcionario create(@Valid @RequestBody Funcionario body) {
        body.setId(null);
        return repository.save(body);
    }

    @PutMapping("/{id}")
    public Funcionario update(@PathVariable Long id, @Valid @RequestBody Funcionario body) {
        if (!repository.existsById(id)) {
            throw new NotFoundException("Funcionario " + id + " not found");
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
