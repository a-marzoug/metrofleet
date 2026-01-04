import argparse

from .trainer import ModelTrainer


def get_model_params(args):
    """Extract model-specific parameters from args."""
    return {
        'n_estimators': args.n_estimators,
        'contamination': args.contamination,
    }


def main():
    parser = argparse.ArgumentParser(
        description='Train anomaly detection model (Isolation Forest)'
    )

    # Model hyperparameters
    parser.add_argument(
        '--n_estimators', type=int, default=100, help='Number of estimators'
    )
    parser.add_argument(
        '--contamination',
        type=float,
        default=0.01,
        help='Contamination rate (expected proportion of outliers)',
    )

    args = parser.parse_args()

    # Train model
    trainer = ModelTrainer()
    model_params = get_model_params(args)

    print(f'Starting Anomaly Detection Training with params: {model_params}')
    trainer.train_anomaly(**model_params)
    print('Training completed.')


if __name__ == '__main__':
    main()
