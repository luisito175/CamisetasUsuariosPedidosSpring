package com.iesvdc.dam.acceso.model;


import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Document(collection = "usuarios")
public class Usuario {

  @Id
  @JsonSerialize(using = ToStringSerializer.class)
  private ObjectId id;

  @NotBlank(message = "nombre es obligatorio")
  private String nombre;

  @NotBlank(message = "email es obligatorio")
  @Email(message = "email no válido")
  private String email;

  @NotBlank(message = "la contraseña es obligatoria")
  private String password;

  @NotBlank(message = "El rol es obligatorio")
  private String rol;
}
