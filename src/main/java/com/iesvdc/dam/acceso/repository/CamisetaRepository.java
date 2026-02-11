package com.iesvdc.dam.acceso.repository;


import com.iesvdc.dam.acceso.model.Camiseta;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface CamisetaRepository extends MongoRepository<Camiseta, ObjectId> {

  List<Camiseta> findByColorIgnoreCase(String color);

  List<Camiseta> findByNombreContainingIgnoreCase(String nombre);
}
