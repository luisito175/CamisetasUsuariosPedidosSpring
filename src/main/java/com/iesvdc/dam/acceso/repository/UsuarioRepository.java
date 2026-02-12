package com.iesvdc.dam.acceso.repository;

import com.iesvdc.dam.acceso.model.Usuario;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface UsuarioRepository extends MongoRepository<Usuario, ObjectId> {

  Optional<Usuario> findByEmailIgnoreCase(String email);
}