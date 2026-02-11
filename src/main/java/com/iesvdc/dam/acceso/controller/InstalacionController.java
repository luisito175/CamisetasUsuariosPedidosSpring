package com.iesvdc.dam.acceso.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.iesvdc.dam.acceso.model.Camiseta;
import com.iesvdc.dam.acceso.service.InstalacionService;

import jakarta.validation.Valid;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;



@RestController
@RequestMapping("/api/instalaciones")
public class InstalacionController {
    
    @Autowired
    private InstalacionService instalacionService;

    @GetMapping({"","/"})
    public List<Camiseta> findAll() {
        return instalacionService.findAll();
    }

    @PostMapping({"","/"})
    @ResponseStatus(HttpStatus.CREATED)
    public Camiseta save(
        @Valid
        @RequestBody Camiseta instalacion) {
         
        return instalacionService.save(instalacion);
    }
    
    @PutMapping("/{id}")
    public Camiseta update(
        @PathVariable String id,
        @Valid @RequestBody Camiseta instalacion){
            
        return instalacionService.updateById(id, instalacion);
    }
    
    
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable String id){
        instalacionService.deleteById(id);
    }
}
