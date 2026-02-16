package com.iesvdc.dam.acceso.service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.iesvdc.dam.acceso.model.Pedido;
import com.iesvdc.dam.acceso.repository.ReservaRepository;
import com.iesvdc.dam.acceso.web.BadRequestException;
import com.iesvdc.dam.acceso.web.NotFoundException;

@Service
public class PedidoService {
    
    @Autowired 
    ReservaRepository reservaRepository;

    public List<Pedido> findAll(){
        return reservaRepository.findAll();
    }

    public Optional<Pedido> findById(String id) {
        try {
            return reservaRepository.findById(new ObjectId(id));
        } catch (IllegalArgumentException e) {
            return Optional.empty();
        }
    }

    /**
    * Guardar pedido
    */
    public Pedido add(Pedido reserva){
        if (reserva.getFechaCreacion() == null) {
            reserva.setFechaCreacion(Instant.now());
        }
        return reservaRepository.save(reserva);
    }

    public void deleteById(String id) {
        try {
            reservaRepository.deleteById(new ObjectId(id));
        } catch (Exception e) {
            throw new BadRequestException("Error eliminando pedido. El ID es obligatorio");
        }
    }

    public Pedido updateById(String id, Pedido reserva){
        Optional<Pedido> oReserva = findById(id);
        if(oReserva.isPresent()){
            reserva.setId(new ObjectId(id));
            if (reserva.getFechaCreacion() == null) {
                reserva.setFechaCreacion(oReserva.get().getFechaCreacion());
            }
            return reservaRepository.save(reserva);
        } else {
            throw new NotFoundException(
                "Pedido no encontrado: " + id);
        }
    }
}