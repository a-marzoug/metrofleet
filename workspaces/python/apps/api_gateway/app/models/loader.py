"""ML model loader and manager."""

import pickle
from typing import Any


class ModelManager:
    def __init__(self):
        self.models: dict[str, Any] = {}

    def load_model(self, model_name: str, model_path: str) -> None:
        """Load a model from disk."""
        try:
            print(f"Loading model '{model_name}' from {model_path}...")
            with open(model_path, 'rb') as f:
                self.models[model_name] = pickle.load(f)
            print(f"✅ Model '{model_name}' loaded successfully.")
        except FileNotFoundError:
            print(f'⚠️ Model file not found: {model_path}')
            self.models[model_name] = None

    def get_model(self, model_name: str) -> Any:
        """Retrieve a loaded model."""
        return self.models.get(model_name)

    def is_loaded(self, model_name: str) -> bool:
        """Check if a model is loaded."""
        return self.models.get(model_name) is not None

    def clear(self) -> None:
        """Clear all loaded models."""
        self.models.clear()


model_manager = ModelManager()
