package com.iesvdc.dam.acceso.repository;

import com.iesvdc.dam.acceso.model.Pedido;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;


public interface ReservaRepository extends MongoRepository<Pedido, ObjectId> {

  
}