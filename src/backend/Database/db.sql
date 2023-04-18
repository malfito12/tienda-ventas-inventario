CREATE TABLE IF NOT EXISTS rols(
	rol_name VARCHAR(50) NOT NULL,
	rol_id SERIAL PRIMARY KEY
);

INSERT INTO rols VALUES ('ADMINISTRADOR'),('SUPERVISOR'),('USUARIO');

CREATE TABLE IF NOT EXISTS users(
	people_name VARCHAR(50) NOT NULL,
    user_name VARCHAR (50) NOT NULL,
	user_email VARCHAR(50) NOT NULL,
	user_password TEXT NOT NULL,
	user_repeat_password VARCHAR(50) NOT NULL,
    user_status VARCHAR(20) NOT NULL,
	user_date DATE NOT NULL,
	user_rol INT NOT NULL,
	user_id SERIAL PRIMARY KEY,
	CONSTRAINT pk_rols FOREIGN KEY (user_rol) REFERENCES rols(rol_id) 
);

INSERT INTO users VALUES ('Primero','admin','admin@gmail.com','21232f297a57a5a743894a0e4a801fc3','admin','ACTIVO', '01-01-2023',1);

CREATE TABLE IF NOT EXISTS clients(
    client_name VARCHAR(30) NOT NULL,
    client_surname_p VARCHAR(15) NOT NULL,
    client_surname_m VARCHAR(15) NOT NULL,
    client_ci VARCHAR (15) NOT NULL,
    client_phone VARCHAR(15) NOT NULL,
    client_address VARCHAR(50) NOT NULL,
    client_register_date DATE NOT NULL,
    user_id INT NOT NULL,
    client_id SERIAL PRIMARY KEY,
    CONSTRAINT pk_users FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS sucursales(
    sucursal_name VARCHAR(50) NOT NULL,
    sucursal_address VARCHAR(50) NOT NULL,
    sucursal_dep VARCHAR(50) NOT NULL,
    sucursal_phone INT NOT NULL,
    user_id INT NOT NULL,
    sucursal_id SERIAL PRIMARY KEY,
    CONSTRAINT pk_users FOREIGN KEY (user_id) REFERENCES users(user_id)
);


CREATE TABLE IF NOT EXISTS u_medidas(
    u_medida_name VARCHAR(50) NOT NULL,
    u_medida_register_date DATE NOT NULL,
    user_id INT NOT NULL,
    u_medida_id SERIAL PRIMARY KEY,
    CONSTRAINT pk_users FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS product_types(
    type_name VARCHAR(50) NOT NULL,
    type_register_date DATE NOT NULL,
    user_id INT NOT NULL,
    type_id SERIAL PRIMARY KEY,
    CONSTRAINT pk_users FOREIGN KEY (user_id) REFERENCES users(user_id)
);


CREATE TABLE IF NOT EXISTS products(
    product_name VARCHAR (50) NOT NULL,
    product_price NUMERIC(20,2) NOT NULL,
    product_price_unit NUMERIC(20,2) NOT NULL,
    product_amount_box INT NOT NULL,
    product_image TEXT,
    product_code VARCHAR(10) NOT NULL,
    product_register_date DATE NOT NULL,
    u_medida_id INT NOT NULL,
    type_id INT NOT NULL,
    user_id INT NOT NULL,
    sucursal_id INT NOT NULL,
    product_id SERIAL PRIMARY KEY,
    CONSTRAINT pk_users FOREIGN KEY (user_id) REFERENCES users(user_id),
    CONSTRAINT pk_u_medidas FOREIGN KEY (u_medida_id) REFERENCES u_medidas(u_medida_id),
    CONSTRAINT pk_product_types FOREIGN KEY (type_id) REFERENCES product_types(type_id),
	CONSTRAINT pk_sucursales FOREIGN KEY (sucursal_id) REFERENCES sucursales(sucursal_id)
);

CREATE TABLE IF NOT EXISTS move_type_product(
    move_type VARCHAR (20) NOT NULL,
    move_id SERIAL PRIMARY KEY    
);

INSERT INTO move_type_product VALUES ('ENTRADA'),('SALIDA'),('INGRESO'),('EGRESO');

CREATE TABLE IF NOT EXISTS stock_products(
    stock NUMERIC (20,2) NOT NULL,
    product_id INT NOT NULL,
    register_date DATE NOT NULL,
    stock_id SERIAL PRIMARY KEY,
    CONSTRAINT pk_products FOREIGN KEY (product_id) REFERENCES products(product_id)

);

CREATE TABLE IF NOT EXISTS products_move(
    product_move_amount NUMERIC (20,2) NOT NULL,
    product_move_price NUMERIC (20,2) NOT NULL,
    product_move_code VARCHAR(20) NOT NULL,
    product_move_register_date DATE NOT NULL,
    product_id INT NOT NULL,
    move_id INT NOT NULL,
    product_move_id SERIAL PRIMARY KEY,
    CONSTRAINT pk_products FOREIGN KEY (product_id) REFERENCES products(product_id),
    CONSTRAINT pk_move_type FOREIGN KEY (move_id) REFERENCES move_type_product(move_id)
);

CREATE TABLE IF NOT EXISTS product_ventas(
    product_total_price NUMERIC(20,2) NOT NULL,
    product_venta_price NUMERIC(20,2) NOT NULL,
    product_venta_code VARCHAR(20) NOT NULL,
    register_date DATE NOT NULL,
    sucursal_id INT NOT NULL,
    client_id INT NOT NULL,
    user_id INT NOT NULL,
    product_venta_id SERIAL PRIMARY KEY,
    CONSTRAINT pk_users FOREIGN KEY (user_id) REFERENCES users(user_id),
	CONSTRAINT pk_sucursales FOREIGN KEY (sucursal_id) REFERENCES sucursales(sucursal_id),
    CONSTRAINT pk_clients FOREIGN KEY (client_id) REFERENCES clients(client_id)
);

CREATE TABLE IF NOT EXISTS ingresos_egresos_caja(
    description_mov VARCHAR(10) NOT NULL,
    motivo_mov TEXT NOT NULL,
    monto_mov NUMERIC(20,2) NOT NULL,
    move_id INT NOT NULL,
    register_date DATE NOT NULL,
    sucursal_id INT NOT NULL,
    ing_eg_id SERIAL NOT NULL,
    CONSTRAINT pk_move_type FOREIGN KEY(move_id) REFERENCES move_type_product(move_id),
    CONSTRAINT pk_sucursales FOREIGN KEY(sucursal_id) REFERENCES sucursales(sucursal_id)
);

CREATE TABLE IF NOT EXISTS libro_semana(
    register_date VARCHAR(10) NOT NULL,
    name_product VARCHAR(50) NOT NULL,
    type_product VARCHAR(50) NOT NULL,
    price_product NUMERIC(20,2) NOT NULL,
    cantidad NUMERIC(20,2) NOT NULL,
    total NUMERIC(20,2) NOT NULL,
    fechaInicio VARCHAR(10) NOT NULL,
    fechaFin VARCHAR(10) NOT NULL,
	move_id INT NOT NULL,
    sucursal_id INT NOT NULL,
    libro_semana_id SERIAL PRIMARY KEY,
    CONSTRAINT pk_sucursales FOREIGN KEY (sucursal_id) REFERENCES sucursales(sucursal_id)
);

CREATE TABLE IF NOT EXISTS total_semana(
    descripcion VARCHAR(50) NOT NULL,
    ingreso NUMERIC(20,2) NOT NULL,
    egreso NUMERIC(20,2) NOT NULL,
    total NUMERIC(20,2) NOT NULL,
    fechaInicio VARCHAR(10) NOT NULL,
    fechaFin VARCHAR(10) NOT NULL,
    register_mes INT NOT NULL,
    register_date DATE NOT NULL,
    sucursal_id INT NOT NULL,
    semana_id SERIAL PRIMARY KEY,
    CONSTRAINT pk_sucursales FOREIGN KEY (sucursal_id) REFERENCES sucursales(sucursal_id)
);
CREATE TABLE IF NOT EXISTS libro_mes(
    register_date VARCHAR(10) NOT NULL,
    product_name VARCHAR(50) NOT NULL,
    type_product VARCHAR(50) NOT NULL,
    type_move INT NOT NULL,
    cantidad NUMERIC(20,2) NOT NULL,
    total NUMERIC(20,2) NOT NULL,
    anio VARCHAR(10) NOT NULL,
    mes VARCHAR(20) NOT NULL,
    sucursal_id INT NOT NULL,
    libro_mes_id SERIAL PRIMARY KEY,
    CONSTRAINT pk_sucursales FOREIGN KEY (sucursal_id) REFERENCES sucursales(sucursal_id)
);
CREATE TABLE IF NOT EXISTS total_mes(
    ingreso NUMERIC(20,2) NOT NULL,
    egreso NUMERIC(20,2) NOT NULL,
    total NUMERIC(20,2) NOT NULL,
    anio VARCHAR(10) NOT NULL,
    mes VARCHAR(20) NOT NULL,
    register_date DATE NOT NULL,
    sucursal_id INT NOT NULL,
    mes_id SERIAL PRIMARY KEY,
    CONSTRAINT pk_sucursales FOREIGN KEY (sucursal_id) REFERENCES sucursales(sucursal_id)
);

-- ALTER SEQUENCE product_types_type_codigo_seq RESTART WITH 100;
-------------------------LISTA PRODUCTOS------------------------
SELECT DISTINCT p.product_name,p.product_price,p.product_amount,s.sucursal_name
FROM products p
INNER JOIN sucursales s ON s.sucursal_id=p.sucursal_id
WHERE p.sucursal_id=2