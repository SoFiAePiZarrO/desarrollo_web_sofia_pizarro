from sqlalchemy import create_engine, Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import sessionmaker, declarative_base, relationship

# Configuración con credenciales de la Tarea 2
DB_NAME = "tarea2"
DB_USERNAME = "cc5002"
DB_PASSWORD = "programacionweb"
DB_HOST = "localhost"
DB_PORT = 3306

DATABASE_URL = f"mysql+pymysql://{DB_USERNAME}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

engine = create_engine(DATABASE_URL, echo=False, future=True)
SessionLocal = sessionmaker(bind=engine)

Base = declarative_base()

# --- Modelos ORM (Mapeo de tablas de tarea2.sql) ---

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

def get_aves():
    session = SessionLocal()
    aves = session.query(Ave).order_by(Ave.nombre.asc()).all()
    session.close()
    return aves

def get_regiones():
    session = SessionLocal()
    regiones = session.query(Region).order_by(Region.nombre.asc()).all()
    session.close()
    return regiones

def get_comunas_by_region(region_id):
    session = SessionLocal()
    comunas = session.query(Comuna).filter_by(region_id=region_id).order_by(Comuna.nombre.asc()).all()
    session.close()
    return comunas

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
    session.close()

def get_voluntarios():
    session = SessionLocal()
    voluntarios = session.query(Voluntario).all()
    session.close()
    return voluntarios

def create_avistamiento(voluntario_id, ave_id, fecha_hora, lugar, descripcion, ruta_archivo=None, nombre_archivo=None):
    session = SessionLocal()
    new_av = Avistamiento(
        voluntario_id=voluntario_id,
        ave_id=ave_id,
        fecha_hora=fecha_hora,
        lugar=lugar,
        descripcion=descripcion
    )
    session.add(new_av)
    session.commit()

    if ruta_archivo and nombre_archivo:
        new_reg = Registro(
            ruta_archivo=ruta_archivo,
            nombre_archivo=nombre_archivo,
            avistamiento_id=new_av.id
        )
        session.add(new_reg)
        session.commit()

    session.close()

def get_avistamientos():
    session = SessionLocal()
    avistamientos = session.query(Avistamiento).all()
    session.close()
    return avistamientos