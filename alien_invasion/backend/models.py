from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# SQLite database (can be replaced with PostgreSQL, MySQL, etc.)
DATABASE_URL = "sqlite:///highscores.db"

Base = declarative_base()

# HighScore model
class HighScore(Base):
    __tablename__ = "high_scores"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), nullable=False)
    score = Column(Integer, nullable=False)

# Create database engine
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create tables if not exist
def init_db():
    Base.metadata.create_all(bind=engine)

# Add a high score to the database
def add_high_score(name, score):
    session = SessionLocal()
    new_score = HighScore(name=name, score=score)
    session.add(new_score)
    session.commit()
    session.close()

# Get top 10 high scores
def get_high_scores():
    session = SessionLocal()
    scores = session.query(HighScore).order_by(HighScore.score.desc()).limit(10).all()
    session.close()
    return [{"name": s.name, "score": s.score} for s in scores]
