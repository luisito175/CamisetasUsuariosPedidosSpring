package com.iesvdc.dam.acceso.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.iesvdc.dam.acceso.model.Pedido;
import com.iesvdc.dam.acceso.service.PedidoService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/reservas")
public class PedidoController {

  @Autowired
  private PedidoService reservaService;

  @GetMapping({"", "/"})
  public List<Pedido> findAll() {
    return reservaService.findAll();
  }

  @GetMapping("/{id}")
  public Pedido findById(@PathVariable String id) {
    return reservaService.findById(id).orElseThrow(() ->
      new com.iesvdc.dam.acceso.web.NotFoundException("Pedido no encontrado: " + id));
  }

  @PostMapping({"", "/"})
  @ResponseStatus(HttpStatus.CREATED)
  public Pedido save(@Valid @RequestBody Pedido reserva) {
    return reservaService.add(reserva);
  }

  @PutMapping("/{id}")
  public Pedido update(@PathVariable String id, @Valid @RequestBody Pedido reserva) {
    return reservaService.updateById(id, reserva);
  }

  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void delete(@PathVariable String id) {
    reservaService.deleteById(id);
  }
}