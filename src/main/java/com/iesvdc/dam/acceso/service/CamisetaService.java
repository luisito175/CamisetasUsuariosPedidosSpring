package com.iesvdc.dam.acceso.service;

import java.util.List;
import java.util.Optional;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.iesvdc.dam.acceso.model.Camiseta;
import com.iesvdc.dam.acceso.repository.CamisetaRepository;
import com.iesvdc.dam.acceso.web.NotFoundException;

@Service
public class CamisetaService {
    
    @Autowired
    CamisetaRepository CamisetaRepository;

    public List<Camiseta> findAll(){
        return CamisetaRepository.findAll();
    }

    public Optional<Camiseta> findById(String id){
        try {
            return CamisetaRepository.findById(new ObjectId(id));
        } catch (IllegalArgumentException e) {
            return Optional.empty();
        }
    }

    public Camiseta save(Camiseta camiseta){
        // Si el id es null, MongoDB lo generará automáticamente
        return CamisetaRepository.save(camiseta);
    }

    public void delete(Camiseta camiseta){
        if (camiseta.getId()!=null){
            deleteById(camiseta.getId().toString());
        } else {
            throw new NotFoundException(
                "Instalación sin ID, no puedo buscarla.");
        }
    }

    public void deleteById(String id){
        if (findById(id).isPresent()){
            CamisetaRepository.deleteById(new ObjectId(id));
        } else {
            throw new NotFoundException(
                "Instalación no encontrada: " + id);
        }
    }

    public Camiseta updateById(String id, Camiseta camiseta){
        Optional<Camiseta> ocamiseta = findById(id);
        if(ocamiseta.isPresent()){
            camiseta.setId(new ObjectId(id));
            return CamisetaRepository.save(camiseta);
        } else {
            throw new NotFoundException(
                "Instalación no encontrada: " + id);
        }
    }

    public Camiseta updateById(Camiseta oldcamiseta, Camiseta camiseta){
        return updateById(oldcamiseta.getId().toString(), camiseta);
    }

}
