package com.iesvdc.dam.acceso.service;

import java.util.List;
import java.util.Optional;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.iesvdc.dam.acceso.model.Usuario;
import com.iesvdc.dam.acceso.repository.UsuarioRepository;
import com.iesvdc.dam.acceso.web.BadRequestException;
// import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import com.iesvdc.dam.acceso.web.NotFoundException;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    public List<Usuario> findAll(){
        return usuarioRepository.findAll();
    }

    public Optional<Usuario> findById(String id) {
        try {
            return usuarioRepository.findById(new ObjectId(id));
        } catch (IllegalArgumentException e) {
            return Optional.empty();
        }
    }

    public Usuario add(Usuario usuario){        
        // usuario.setPassword(new BCryptPasswordEncoder().encode(usuario.getPassword()));
        return usuarioRepository.save(usuario);
    }

    public void deleteById(String id) {
        try {
            usuarioRepository.deleteById(new ObjectId(id));
        } catch (Exception e) {            
            throw new BadRequestException("Error eliminando usuario. El ID es obligatorio");
        }
    }

    public Usuario updateById(String id, Usuario usuario){
        Optional<Usuario> ousuario = findById(id);
        if(ousuario.isPresent()){
            usuario.setId(new ObjectId(id));
            return usuarioRepository.save(usuario);
        } else {
            throw new NotFoundException(
                "Usuario no encontrado: " + id);
        }
    }

}
