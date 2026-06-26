package com.app.web;

import com.app.entity.Lotacao;
import com.app.repository.LotacaoRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/lotacaos")
public class LotacaoController {

    private final LotacaoRepository repository;

    public LotacaoController(LotacaoRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Lotacao> list() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public Lotacao get(@PathVariable Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Lotacao " + id + " not found"));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Lotacao create(@Valid @RequestBody Lotacao body) {
        body.setId(null);
        return repository.save(body);
    }

    @PutMapping("/{id}")
    public Lotacao update(@PathVariable Long id, @Valid @RequestBody Lotacao body) {
        if (!repository.existsById(id)) {
            throw new NotFoundException("Lotacao " + id + " not found");
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
