/* global $ */

const API = {
  camisetas: "/api/instalaciones",
  usuarios: "/api/usuarios",
  pedido: "/api/reservas"
};

let lastPedidos = [];
let carritoPedido = [];


/* =========================
   Eventos de formularios
   ========================= */

function wireEvents() {
  $("#formCamisetas").on("submit", function (e) {
    e.preventDefault();
    const editId = $("#btnGuardar").data("edit-id");
    if (editId) {
      actualizarCamiseta(editId);
    } else {
      crearCamiseta();
    }
  });

  

  $("#formUsuario").on("submit", function (e) {
    e.preventDefault();
    const editId = $("#btnGuardarUsuario").data("edit-id");
    if (editId) {
      actualizarUsuario(editId);
    } else {
      crearUsuario();
    }
  });

  $("#formPedido").on("submit", function (e) {
    e.preventDefault();
    crearPedido();
  });

  $("#btnAddCamiseta").on("click", function () {
    agregarCamisetaAlCarrito();
  });

  $("#btnVolverPedidos").on("click", function () {
    $.controller.activate("#panel_pedidos");
  });

  // Menú de navegación
  $("#menu_camisetas").on("click", function () {
    $(".panel").addClass("d-none");
    $("#panel_camisetas").removeClass("d-none");
  });

  $("#menu_usuarios").on("click", function () {
    $(".panel").addClass("d-none");
    $("#panel_usuarios").removeClass("d-none");
  });

  $("#menu_pedidos").on("click", function () {
    $(".panel").addClass("d-none");
    $("#panel_pedidos").removeClass("d-none");
  });

}

/* =========================
   Alertas y utilidades
   ========================= */

function showAlert(type, msg) {
  $("#alerta")
    .removeClass("d-none alert-success alert-danger alert-warning alert-info")
    .addClass("alert-" + type)
    .text(msg);

  setTimeout(() => $("#alerta").addClass("d-none"), 3000);
}

function parseApiError(xhr, fallbackMsg) {
  const r = xhr.responseJSON;
  if (!r) return fallbackMsg;

  if (Array.isArray(r.details) && r.details.length > 0) {
    return `${r.message}: ${r.details.join(" | ")}`;
  }
  return r.message || fallbackMsg;
}

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

/* =========================
   Carga inicial
   ========================= */

function cargarTodo() {
  $.when(cargarCamisetas(), cargarUsuarios())
    .done(function () {
      cargarPedidos();
    })
    .fail(function () {
      showAlert("danger", "Error cargando datos iniciales");
    });
}

/* =========================
   Camisetas
   ========================= */

function cargarCamisetas() {
  return $.getJSON(API.camisetas)
    .done(function (data) {
      renderCamisetas(data);
      rellenarSelectCamisetas(data);
    })
    .fail(function (xhr) {
      showAlert("danger", parseApiError(xhr, "Error cargando camisetas"));
    });
}

function renderCamisetas(camisetas) {
  const rows = (camisetas || []).map(function (c) {
    return `
      <tr>
        <td>${escapeHtml(c.nombre)}</td>
        <td>${escapeHtml(c.talla)}</td>
        <td>${escapeHtml(c.color)}</td>
        <td>${parseFloat(c.precio).toFixed(2)}€</td>
        <td>${c.stock}</td>
        <td class="text-end">
          <button class="btn btn-sm btn-outline-warning" data-action="edit-cam" data-id="${c.id}">
            Editar
          </button>
          <button class="btn btn-sm btn-outline-danger" data-action="del-cam" data-id="${c.id}">
            Eliminar
          </button>
        </td>
      </tr>
    `;
  }).join("");

  $("#tablaCamisetas").html(rows || `<tr><td colspan="6" class="text-center text-muted">Sin datos</td></tr>`);

  // Botón Editar
  $("#tablaCamisetas button[data-action='edit-cam']").off("click").on("click", function () {
    const id = $(this).data("id");
    editarCamiseta(id);
  });

  // Botón Eliminar
  $("#tablaCamisetas button[data-action='del-cam']").off("click").on("click", function () {
    const id = $(this).data("id");
    eliminarCamiseta(id);
  });
}

function rellenarSelectCamisetas(camisetas) {
  const opts = (camisetas || []).map(c =>
    `<option value="${c.id}" data-nombre="${escapeHtml(c.nombre)}" data-talla="${escapeHtml(c.talla)}" data-color="${escapeHtml(c.color)}" data-precio="${c.precio}">
      ${escapeHtml(c.nombre)} (${escapeHtml(c.talla)} - ${escapeHtml(c.color)})
    </option>`
  ).join("");

  // Selects: filtros y alta
  $("#filtroCamiseta").html(`<option value="">Todas</option>${opts}`);
  $("#resCamiseta").html(`<option value="" disabled selected>Seleccione...</option>${opts}`);
}

function crearCamiseta() {
  const payload = {
    nombre: $("#camNombre").val().trim(),
    talla: $("#camTalla").val().trim(),
    color: $("#camColor").val().trim(),
    precio: parseFloat($("#camPrecio").val()),
    stock: parseInt($("#camStock").val())
  };

  $.ajax({
    url: API.camisetas,
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify(payload)
  })
    .done(function () {
      showAlert("success", "Camiseta creada");
      $("#formCamisetas")[0].reset();
      $("#btnGuardar").text("Añadir");
      cargarCamisetas();
    })
    .fail(function (xhr) {
      showAlert("danger", parseApiError(xhr, "Error creando camiseta"));
    });
}

function editarCamiseta(id) {
  
  const camisetaRow = $(`button[data-action='edit-cam'][data-id='${id}']`).closest("tr");
  
  const nombre = camisetaRow.find("td").eq(0).text().trim();
  const talla = camisetaRow.find("td").eq(1).text().trim();
  const color = camisetaRow.find("td").eq(2).text().trim();
  const precio = camisetaRow.find("td").eq(3).text().replace("€", "").trim();
  const stock = camisetaRow.find("td").eq(4).text().trim();

  
  $("#camNombre").val(nombre);
  $("#camTalla").val(talla);
  $("#camColor").val(color);
  $("#camPrecio").val(precio);
  $("#camStock").val(stock);

  
  $("#btnGuardar").text("Actualizar").data("edit-id", id);
}

function actualizarCamiseta(id) {
  const payload = {
    nombre: $("#camNombre").val().trim(),
    talla: $("#camTalla").val().trim(),
    color: $("#camColor").val().trim(),
    precio: parseFloat($("#camPrecio").val()),
    stock: parseInt($("#camStock").val())
  };

  $.ajax({
    url: `${API.camisetas}/${id}`,
    method: "PUT",
    contentType: "application/json",
    data: JSON.stringify(payload)
  })
    .done(function () {
      showAlert("success", "Camiseta actualizada");
      $("#formCamisetas")[0].reset();
      $("#btnGuardar").text("Añadir").data("edit-id", null);
      cargarCamisetas();
    })
    .fail(function (xhr) {
      showAlert("danger", parseApiError(xhr, "Error actualizando camiseta"));
    });
}

function eliminarCamiseta(id) {
  if (!confirm("¿Eliminar la camiseta?")) return;

  $.ajax({
    url: `${API.camisetas}/${id.toString()}`,
    method: "DELETE"
  })
    .done(function () {
      showAlert("success", "Camiseta eliminada");
      cargarCamisetas();
    })
    .fail(function (xhr) {
      showAlert("danger", parseApiError(xhr, "Error eliminando camiseta"));
    });
}


/* =========================
   Usuarios
   ========================= */

function cargarUsuarios() {
  return $.getJSON(API.usuarios)
    .done(function (data) {
      renderUsuarios(data);
      rellenarSelectUsuarios(data);
    })
    .fail(function (xhr) {
      showAlert("danger", parseApiError(xhr, "Error cargando usuarios"));
    });
}

function renderUsuarios(usuarios) {
  const rows = (usuarios || []).map(function (u) {
    return `
      <tr>
        <td>${escapeHtml(u.nombre)}</td>
        <td>${escapeHtml(u.email)}</td>
        <td>${escapeHtml(u.password)}</td>
        <td>${escapeHtml(u.rol)}</td>
        <td class="text-end">

          <button class="btn btn-sm btn-outline-warning" data-action="edit-user" data-id="${u.id}">
            Editar
          </button>

          <button class="btn btn-sm btn-outline-danger" data-action="del-user" data-id="${u.id}">
            Eliminar
          </button>
        </td>
      </tr>
    `;
  }).join("");

  $("#tablaUsuarios").html(rows || `<tr><td colspan="5" class="text-center text-muted">Sin datos</td></tr>`);

  
  $("#tablaUsuarios button[data-action='edit-user']").off("click").on("click", function () {
    const id = $(this).data("id");
    editarUsuario(id);
  });

  $("#tablaUsuarios button[data-action='del-user']").off("click").on("click", function () {
    const id = $(this).data("id");
    eliminarUsuario(id);
  });
}

function rellenarSelectUsuarios(usuarios) {
  const opts = (usuarios || []).map(u =>
    `<option value="${u.id}">${escapeHtml(u.nombre)} (${escapeHtml(u.email)})</option>`
  ).join("");

  $("#filtroUsuario").html(`<option value="">Todos</option>${opts}`);
  $("#resUsuario").html(`<option value="" disabled selected>Seleccione...</option>${opts}`);
}

function crearUsuario() {
  const payload = {
    nombre: $("#userNombre").val().trim(),
    email: $("#userEmail").val().trim(),
    password: $("#userPassword").val().trim(),
    rol: $("#userRol").val().trim()
  };

  $.ajax({
    url: API.usuarios,
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify(payload)
  })
    .done(function () {
      showAlert("success", "Usuario creado");
      $("#formUsuario")[0].reset();
      cargarUsuarios();
    })
    .fail(function (xhr) {
      showAlert("danger", parseApiError(xhr, "Error creando usuario"));
    });
}

function editarUsuario(id) {
  
  const usuarioRow = $(`button[data-action='edit-user'][data-id='${id}']`).closest("tr");
  
  const nombre = usuarioRow.find("td").eq(0).text().trim();
  const email = usuarioRow.find("td").eq(1).text().trim();
  const password = usuarioRow.find("td").eq(2).text().trim();
  const rol = usuarioRow.find("td").eq(3).text().trim();

  
  $("#userNombre").val(nombre);
  $("#userEmail").val(email);
  $("#userPassword").val(password);
  $("#userRol").val(rol);


  
  $("#btnGuardarUsuario").text("Actualizar").data("edit-id", id);
}

function actualizarUsuario(id) {
  const payload = {
    nombre: $("#userNombre").val().trim(),
    email: $("#userEmail").val().trim(),
    password: $("#userPassword").val().trim(),
    rol: $("#userRol").val().trim()
  };

  $.ajax({
    url: `${API.usuarios}/${id}`,
    method: "PUT",
    contentType: "application/json",
    data: JSON.stringify(payload)
  })
    .done(function () {
      showAlert("success", "Usuario actualizado");
      $("#formUsuario")[0].reset();
      $("#btnGuardarUsuario").text("Añadir").data("edit-id", null);
      cargarUsuarios();
    })
    .fail(function (xhr) {
      showAlert("danger", parseApiError(xhr, "Error actualizando usuario"));
    });
}

function eliminarUsuario(id) {
  if (!confirm("¿Eliminar el usuario?")) return;

  $.ajax({
    url: `${API.usuarios}/${id}`,
    method: "DELETE"
  })
    .done(function () {
      showAlert("success", "Usuario eliminado");
      cargarUsuarios();
    })
    .fail(function (xhr) {
      showAlert("danger", parseApiError(xhr, "Error eliminando usuario"));
    });
}

/* =========================
   Pedidos
   ========================= */

function cargarPedidos() {
  return $.getJSON(API.pedido)
    .done(function (data) {
      renderPedidos(data);
    })
    .fail(function (xhr) {
      showAlert("danger", parseApiError(xhr, "Error cargando pedidos"));
    });
}

function crearPedido() {
  if (carritoPedido.length === 0) {
    showAlert("warning", "Añade camisetas al carrito");
    return;
  }

  const payload = {
    usuarioId: $("#resUsuario").val(),
    fechaCreacion: new Date().toISOString(),
    camisetas: carritoPedido
  };

  $.ajax({
    url: API.pedido,
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify(payload)
  })
    .done(function () {
      showAlert("success", "Pedido creado");
      $("#formPedido")[0].reset();
      carritoPedido = [];
      renderCarrito();
      cargarPedidos();
    })
    .fail(function (xhr) {
      showAlert("danger", parseApiError(xhr, "Error creando pedido"));
    });
}

function eliminarPedido(id) {
  if (!confirm("¿Eliminar el pedido?")) return;

  $.ajax({
    url: `${API.pedido}/${id}`,
    method: "DELETE"
  })
    .done(function () {
      showAlert("success", "Pedido eliminado");
      cargarPedidos();
    })
    .fail(function (xhr) {
      showAlert("danger", parseApiError(xhr, "Error eliminando pedido"));
    });
}

function renderPedidos(pedidos) {
  const usuariosMap = construirUsuariosMap();
  const rows = (pedidos || []).map(function (p) {
    const usuarioNombre = usuariosMap.get(p.usuarioId) || p.usuarioId;
    const fecha = p.fechaCreacion ? new Date(p.fechaCreacion).toLocaleDateString() : "";
    const totalItems = (p.camisetas || []).reduce((acc, it) => acc + (it.cantidad || 0), 0);

    return `
      <tr>
        <td>${escapeHtml(fecha)}</td>
        <td>${escapeHtml(usuarioNombre)}</td>
        <td>${totalItems}</td>
        <td class="text-end">
          <button class="btn btn-sm btn-outline-secondary" data-action="ver-ped" data-id="${p.id}">
            Ver
          </button>
          <button class="btn btn-sm btn-outline-danger" data-action="del-ped" data-id="${p.id}">
            Eliminar
          </button>
        </td>
      </tr>
    `;
  }).join("");

  $("#tablaPedidos").html(rows || `<tr><td colspan="4" class="text-center text-muted">Sin datos</td></tr>`);

  $("#tablaPedidos button[data-action='del-ped']").off("click").on("click", function () {
    const id = $(this).data("id");
    eliminarPedido(id);
  });

  $("#tablaPedidos button[data-action='ver-ped']").off("click").on("click", function () {
    const id = $(this).data("id");
    mostrarDetallePedido(id);
  });
}

function mostrarDetallePedido(id) {
  $.getJSON(`${API.pedido}/${id}`)
    .done(function (pedido) {
      const usuariosMap = construirUsuariosMap();
      const fecha = pedido.fechaCreacion ? new Date(pedido.fechaCreacion).toLocaleDateString() : "";
      const usuarioNombre = usuariosMap.get(pedido.usuarioId) || pedido.usuarioId;
      const totalItems = (pedido.camisetas || []).reduce((acc, it) => acc + (it.cantidad || 0), 0);

      $("#detallePedidoFecha").text(fecha);
      $("#detallePedidoUsuario").text(usuarioNombre);
      $("#detallePedidoTotal").text(totalItems);

      const rows = (pedido.camisetas || []).map(it => `
        <tr>
          <td>${escapeHtml(it.nombre)}</td>
          <td>${escapeHtml(it.talla)}</td>
          <td>${escapeHtml(it.color)}</td>
          <td>${parseFloat(it.precio).toFixed(2)}€</td>
          <td>${it.cantidad}</td>
        </tr>
      `).join("");

      $("#tablaPedidoDetalle").html(rows || `<tr><td colspan="5" class="text-center text-muted">Sin detalles</td></tr>`);

      // Mostrar panel detalle con animación
      $(".panel").hide(200);
      $("#panel_pedido_detalle").removeClass("d-none").hide().fadeIn(200);
    })
    .fail(function (xhr) {
      showAlert("danger", parseApiError(xhr, "Error cargando detalle del pedido"));
    });
}

function agregarCamisetaAlCarrito() {
  const $opt = $("#resCamiseta option:selected");
  if ($opt.length === 0) {
    showAlert("warning", "Seleccione una camiseta");
    return;
  }

  const item = {
    camisetaId: $opt.val(),
    nombre: $opt.data("nombre"),
    talla: $opt.data("talla"),
    color: $opt.data("color"),
    precio: parseFloat($opt.data("precio")),
    cantidad: 1
  };

  const existente = carritoPedido.find(c => c.camisetaId === item.camisetaId);
  if (existente) {
    existente.cantidad += 1;
  } else {
    carritoPedido.push(item);
  }
  renderCarrito();
}

function renderCarrito() {
  const rows = carritoPedido.map((it, idx) => {
    const label = `${it.nombre} (${it.talla} - ${it.color})`;
    return `
      <tr>
        <td>${escapeHtml(label)}</td>
        <td>
          <div class="btn-group btn-group-sm" role="group">
            <button class="btn btn-outline-secondary" data-action="dec-car" data-index="${idx}">-</button>
            <span class="px-2">${it.cantidad}</span>
            <button class="btn btn-outline-secondary" data-action="inc-car" data-index="${idx}">+</button>
          </div>
        </td>
        <td class="text-end">
          <button class="btn btn-sm btn-outline-danger" data-action="del-car" data-index="${idx}">Quitar</button>
        </td>
      </tr>
    `;
  }).join("");

  $("#tablaCarrito").html(rows || `<tr><td colspan="3" class="text-center text-muted">Carrito vacío</td></tr>`);

  $("#tablaCarrito button[data-action='inc-car']").off("click").on("click", function () {
    const idx = $(this).data("index");
    carritoPedido[idx].cantidad += 1;
    renderCarrito();
  });

  $("#tablaCarrito button[data-action='dec-car']").off("click").on("click", function () {
    const idx = $(this).data("index");
    carritoPedido[idx].cantidad = Math.max(1, carritoPedido[idx].cantidad - 1);
    renderCarrito();
  });

  $("#tablaCarrito button[data-action='del-car']").off("click").on("click", function () {
    const idx = $(this).data("index");
    carritoPedido.splice(idx, 1);
    renderCarrito();
  });
}

/* =========================
   Mapas auxiliares
   ========================= */

function construirUsuariosMap() {
  // Construye un mapa id -> nombre leyendo la tabla ya cargada.
  // Alternativa: guardar el último listado en una variable global.
  const map = new Map();

  // Se intenta construir desde el select de reservas (que contiene nombre + email).
  $("#resUsuario option").each(function () {
    const val = $(this).attr("value");
    const txt = $(this).text();
    if (val) map.set(val, txt);
  });

  return map;
}

// Iniciar cuando el DOM está listo
$(document).ready(function () {
  wireEvents();
  cargarTodo();
});