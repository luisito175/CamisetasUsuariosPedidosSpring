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
public class InstalacionService {
    
    @Autowired
    CamisetaRepository instalacionRepository;

    public List<Camiseta> findAll(){
        return instalacionRepository.findAll();
    }

    public Optional<Camiseta> findById(String id){
        try {
            return instalacionRepository.findById(new ObjectId(id));
        } catch (IllegalArgumentException e) {
            return Optional.empty();
        }
    }

    public Camiseta save(Camiseta instalacion){
        // Si el id es null, MongoDB lo generará automáticamente
        return instalacionRepository.save(instalacion);
    }

    public void delete(Camiseta instalacion){
        if (instalacion.getId()!=null){
            deleteById(instalacion.getId().toString());
        } else {
            throw new NotFoundException(
                "Instalación sin ID, no puedo buscarla.");
        }
    }

    public void deleteById(String id){
        if (findById(id).isPresent()){
            instalacionRepository.deleteById(new ObjectId(id));
        } else {
            throw new NotFoundException(
                "Instalación no encontrada: " + id);
        }
    }

    public Camiseta updateById(String id, Camiseta instalacion){
        Optional<Camiseta> oInstalacion = findById(id);
        if(oInstalacion.isPresent()){
            instalacion.setId(new ObjectId(id));
            return instalacionRepository.save(instalacion);
        } else {
            throw new NotFoundException(
                "Instalación no encontrada: " + id);
        }
    }

    public Camiseta updateById(Camiseta oldInstalacion, Camiseta instalacion){
        return updateById(oldInstalacion.getId().toString(), instalacion);
    }

}
