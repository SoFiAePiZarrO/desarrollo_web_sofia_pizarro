from sqlalchemy import create_engine, Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import sessionmaker, declarative_base, relationship, joinedload

# credenciales
DB_NAME = "tarea2"
DB_USERNAME = "cc5002"
DB_PASSWORD = "programacionweb"
DB_HOST = "localhost"
DB_PORT = 3306

DATABASE_URL = f"mysql+pymysql://{DB_USERNAME}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

engine = create_engine(DATABASE_URL, echo=False, future=True)
SessionLocal = sessionmaker(bind=engine)

Base = declarative_base()


class Region(Base):
    __tablename__ = 'region'

    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(200), nullable=False)

    comunas = relationship("Comuna", back_populates="region")


class Comuna(Base):
    __tablename__ = 'comuna'

    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(200), nullable=False)
    region_id = Column(Integer, ForeignKey('region.id'), nullable=False)

    region = relationship("Region", back_populates="comunas")
    voluntarios = relationship("Voluntario", back_populates="comuna")


class Voluntario(Base):
    __tablename__ = 'voluntario'

    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(200), nullable=False)
    email = Column(String(100), nullable=False)
    telefono = Column(String(100), nullable=True)
    fecha_registro = Column(DateTime, nullable=False)
    comuna_id = Column(Integer, ForeignKey('comuna.id'), nullable=False)

    comuna = relationship("Comuna", back_populates="voluntarios")
    avistamientos = relationship("Avistamiento", back_populates="voluntario")


class Ave(Base):
    __tablename__ = 'ave'

    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(200), nullable=False)

    avistamientos = relationship("Avistamiento", back_populates="ave")


class Avistamiento(Base):
    __tablename__ = 'avistamiento'

    id = Column(Integer, primary_key=True, autoincrement=True)
    fecha_hora = Column(DateTime, nullable=False)
    lugar = Column(String(200), nullable=False)
    descripcion = Column(String(500), nullable=True)
    voluntario_id = Column(Integer, ForeignKey('voluntario.id'), nullable=False)
    ave_id = Column(Integer, ForeignKey('ave.id'), nullable=False)

    voluntario = relationship("Voluntario", back_populates="avistamientos")
    ave = relationship("Ave", back_populates="avistamientos")
    registros = relationship("Registro", back_populates="avistamiento")


class Registro(Base):
    __tablename__ = 'registro'

    id = Column(Integer, primary_key=True, autoincrement=True)
    ruta_archivo = Column(String(200), nullable=False)
    nombre_archivo = Column(String(200), nullable=False)
    avistamiento_id = Column(Integer, ForeignKey('avistamiento.id'), nullable=False)

    avistamiento = relationship("Avistamiento", back_populates="registros")


# --- Database Functions ---

# Pide a la base de datos todas las aves para el registro de avistamientos
def get_aves():
    session = SessionLocal()
    aves = session.query(Ave).order_by(Ave.nombre.asc()).all()
    session.close()
    return aves

# Pide a la base de datos todas las regiones para el registro de voluntarios
def get_regiones():
    session = SessionLocal()
    regiones = session.query(Region).order_by(Region.nombre.asc()).all()
    session.close()
    return regiones

# Pide a la base de datos las comunas asociadas a la región seleccionada
def get_comunas_by_region(region_id):
    session = SessionLocal()
    comunas = session.query(Comuna).filter_by(region_id=region_id).order_by(Comuna.nombre.asc()).all()
    session.close()
    return comunas

# Crea un nuevo voluntario en la base de datos
def create_voluntario(nombre, email, telefono, fecha_registro, comuna_id):
    session = SessionLocal()

    new_vol = Voluntario(
        nombre=nombre,
        email=email,
        telefono=telefono,
        fecha_registro=fecha_registro,
        comuna_id=comuna_id
    )

    session.add(new_vol)
    session.commit()
    session.refresh(new_vol)

    session.expunge(new_vol)
    session.close()

    return new_vol

# Pide a la base de datos todos los voluntarios para el registro de avistamientos
def get_voluntarios():
    session = SessionLocal()
    voluntarios = session.query(Voluntario).all()
    session.close()
    return voluntarios

# Crea un nuevo avistamiento en la base de datos, junto con sus registros asociados
def create_avistamiento(voluntario_id, ave_id, fecha_hora, lugar, descripcion, archivos=None):
    session = SessionLocal()
    new_av = Avistamiento(
        voluntario_id=voluntario_id,
        ave_id=ave_id,
        fecha_hora=fecha_hora,
        lugar=lugar,
        descripcion=descripcion
    )
    session.add(new_av)
    session.commit()  # Genera new_av.id automáticamente

    # Insertar múltiples registros en la tabla 'registro'
    if archivos:
        for arch in archivos:
            new_reg = Registro(
                ruta_archivo=arch["ruta_archivo"],
                nombre_archivo=arch["nombre_archivo"],
                avistamiento_id=new_av.id
            )
            session.add(new_reg)
        session.commit()

    session.close()
    return new_av


# Pide a la base de datos los avistamientos registrados, paginando los resultados
def get_avistamientos_paginados(pagina=1, por_pagina=5):
    session = SessionLocal()

    try:
        query = (
            session.query(Avistamiento)
            .options(
                joinedload(Avistamiento.ave),
                joinedload(Avistamiento.voluntario),
                joinedload(Avistamiento.registros)
            )
            .order_by(Avistamiento.id.desc())
        )

        total = query.count()

        avistamientos = (
            query
            .offset((pagina - 1) * por_pagina)
            .limit(por_pagina)
            .all()
        )

        return avistamientos, total

    finally:
        session.close()


# Pide a la base de datos los últimos avistamientos registrados, limitando la cantidad a 2 por enunciado
def get_ultimos_avistamientos(limite=2): 
    session = SessionLocal()

    try:
        avistamientos = (
            session.query(Avistamiento)
            .options(
                joinedload(Avistamiento.ave),
                joinedload(Avistamiento.voluntario),
                joinedload(Avistamiento.registros)
            )
            .order_by(Avistamiento.id.desc())
            .limit(limite)
            .all()
        )

        return avistamientos

    finally:
        session.close()

# Pide a la base de datos un voluntario específico según su nombre y correo electrónico
def get_voluntario_by_nombre_email(nombre, email):
    session = SessionLocal()

    try:
        voluntario = (
            session.query(Voluntario)
            .filter(
                Voluntario.nombre == nombre,
                Voluntario.email == email
            )
            .first()
        )

        return voluntario

    finally:
        session.close()