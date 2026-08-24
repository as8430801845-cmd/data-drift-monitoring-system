import pandas as pd

def get_drift_analysis():
    # Load the data files you created
    try:
        reference = pd.read_csv("reference.csv")
        current = pd.read_csv("production.csv")
    except:
        return {"error": "CSV files not found. Run setup_data.py first."}

    results = {}
    drift_count = 0

    # Check each column for drift
    for col in reference.columns:
        ref_mean = reference[col].mean()
        cur_mean = current[col].mean()

        # Calculate how much the data changed (Percentage)
        diff = abs(ref_mean - cur_mean) / (ref_mean if ref_mean != 0 else 1)

        # If change is > 20%, we call it "Drift"
        is_drifted = diff > 0.20

        if is_drifted:
            drift_count += 1

        results[col] = {
            "drift_detected": bool(is_drifted),
            "drift_score": float(diff),
            "stat_test_name": "Mean Shift Analysis",
        }

    return {
        "metrics": [{
            "result": {
                "dataset_drift": bool(drift_count > 0),
                "share_of_drifted_columns": float(
                    drift_count / len(reference.columns)
                ),
                "drift_by_columns": results,
            }
        }]
    }
