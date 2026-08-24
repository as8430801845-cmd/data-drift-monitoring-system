import pandas as pd
import numpy as np

def generate_data(size, drift=False):
    data = {
        "income": np.random.normal(50000, 15000, size),
        "age": np.random.randint(18, 70, size),
        "credit_score": np.random.normal(650, 100, size),
        "loan_amount": np.random.normal(200000, 50000, size),
        "tenure_months": np.random.randint(12, 360, size),
        "dependents": np.random.randint(0, 5, size),
        "monthly_debt": np.random.normal(2000, 800, size),
    }

    df = pd.DataFrame(data)

    if drift:
        # Simulate a market shift
        df["income"] = df["income"] * 0.75
        df["loan_amount"] = df["loan_amount"] * 1.3
        df["monthly_debt"] = df["monthly_debt"] * 1.2

    return df

ref = generate_data(5000, drift=False)
prod = generate_data(5000, drift=True)

ref.to_csv("reference.csv", index=False)
prod.to_csv("production.csv", index=False)

print("7-Feature Dataset Generated.")
