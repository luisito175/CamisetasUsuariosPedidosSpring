package com.iesvdc.dam.acceso.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.data.convert.ReadingConverter;
import org.springframework.data.convert.WritingConverter;
import org.springframework.data.mongodb.core.convert.MongoCustomConversions;

import com.iesvdc.dam.acceso.model.Camiseta.Talla;
import org.springframework.lang.NonNull;

import java.time.LocalTime;
import java.util.List;

@Configuration
public class MongoTimeConfig {

  @Bean
  @SuppressWarnings("null")
  public MongoCustomConversions mongoCustomConversions() {
    List<?> converters = List.of(
      new LocalTimeToString(),
      new StringToLocalTime(),
      new TallaToString(),
      new StringToTalla()
    );

    return new MongoCustomConversions(converters);
  }

  @WritingConverter
  static class LocalTimeToString implements Converter<LocalTime, String> {
    @Override public String convert(@NonNull LocalTime source) {
      return source.toString(); // "10:00"
    }
  }

  @ReadingConverter
  static class StringToLocalTime implements Converter<String, LocalTime> {
    @Override public LocalTime convert(@NonNull String source) {
      return LocalTime.parse(source);
    }
  }

  @WritingConverter
  static class TallaToString implements Converter<Talla, String> {
    @Override public String convert(@NonNull Talla source) {
      return source.name();
    }
  }

  @ReadingConverter
  static class StringToTalla implements Converter<String, Talla> {
    @Override public Talla convert(@NonNull String source) {
      try {
        return Talla.valueOf(source.trim().toUpperCase());
      } catch (Exception ex) {
        return Talla.M;
      }
    }
  }
}
