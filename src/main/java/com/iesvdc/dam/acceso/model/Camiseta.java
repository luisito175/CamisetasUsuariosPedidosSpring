package com.iesvdc.dam.acceso.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "camisetas")
public class Camiseta {

  @Id
  @JsonSerialize(using = ToStringSerializer.class)
  private ObjectId id;

  @NotBlank(message = "El nombre es obligatorio")
  private String nombre;

  @NotBlank(message = "La talla es obligatoria")
  private String talla;

  @NotBlank(message = "El color es obligatorio")
  private String color;

  @Positive(message = "El precio debe ser mayor a 0")
  private double precio;

  @Positive(message = "El stock debe ser mayor a 0")
  private int stock;





  // Constructor necesario para maestro-detalle Horario->Instalación
  public Camiseta(String id){
    this.id = new ObjectId(id);
    this.nombre="Instalación sin nombre";
    this.talla="Instalación sin talla";
    this.color="Instalación sin color";
    this.precio=0.0;
    this.stock = 0;
  }

}

