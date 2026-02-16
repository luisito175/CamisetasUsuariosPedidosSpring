package com.iesvdc.dam.acceso.model;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;

import java.time.Instant;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Document(collection = "pedidos")
public class Pedido {

  @Id
  @JsonSerialize(using = ToStringSerializer.class)
  private ObjectId id;

  @NotNull(message = "fechaCreacion es obligatoria")
  private Instant fechaCreacion;

  @NotBlank(message = "usuarioId es obligatorio")
  private String usuarioId;

  @Valid
  @NotEmpty(message = "camisetas es obligatorio")
  private List<PedidoItem> camisetas;

  @Data
  @NoArgsConstructor
  @AllArgsConstructor
  public static class PedidoItem {
    @NotBlank(message = "camisetaId es obligatorio")
    private String camisetaId;

    @NotBlank(message = "nombre es obligatorio")
    private String nombre;

    @NotBlank(message = "talla es obligatoria")
    private String talla;

    @NotBlank(message = "color es obligatorio")
    private String color;

    @NotNull(message = "precio es obligatorio")
    private Double precio;

    @NotNull(message = "cantidad es obligatoria")
    private Integer cantidad;
  }
}