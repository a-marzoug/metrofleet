import argparse

from .trainer import ModelTrainer


def get_model_params(args):
    """Extract model-specific parameters from args."""
    params = {}

    if args.model_type == 'xgboost':
        params = {
            'n_estimators': args.n_estimators,
            'learning_rate': args.learning_rate,
            'max_depth': args.max_depth,
        }
    elif args.model_type == 'random_forest':
        params = {
            'n_estimators': args.n_estimators,
            'max_depth': args.max_depth,
        }
    # Linear regression doesn't need these params

    return params


def main():
    parser = argparse.ArgumentParser(
        description='Train regression model for price prediction'
    )

    # Model selection
    parser.add_argument(
        '--model_type',
        type=str,
        default='xgboost',
        choices=['xgboost', 'linear', 'random_forest'],
        help='Type of regression model to train',
    )

    # Model hyperparameters
    parser.add_argument(
        '--n_estimators', type=int, default=100, help='Number of estimators'
    )
    parser.add_argument(
        '--learning_rate', type=float, default=0.05, help='Learning rate (XGBoost only)'
    )
    parser.add_argument('--max_depth', type=int, default=10, help='Maximum tree depth')

    args = parser.parse_args()

    # Train model
    trainer = ModelTrainer()
    model_params = get_model_params(args)

    pipeline, mae = trainer.train(args.model_type, **model_params)
    print(f'Training completed. Final MAE: ${mae:.2f}')


if __name__ == '__main__':
    main()
