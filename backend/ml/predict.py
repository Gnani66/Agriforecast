import sys
import json
import logging
from prophet import Prophet
import pandas as pd

# Suppress Prophet logging
logging.getLogger("prophet").setLevel(logging.WARNING)
logging.getLogger("cmdstanpy").disabled = True

def main():
    try:
        # Read from standard input
        input_data = sys.stdin.read()
        if not input_data:
            print(json.dumps({"error": "No input data provided"}))
            sys.exit(1)
            
        data = json.loads(input_data)
        
        # Expecting a list of dicts with 'date' and 'value', and 'periods'
        records = data.get("history", [])
        periods = data.get("periods", 7) # default to predicting 7 days
        
        if len(records) < 2:
            print(json.dumps({"error": "Not enough data points for Prophet to fit."}))
            sys.exit(1)
            
        # Convert to DataFrame
        df = pd.DataFrame(records)
        df.rename(columns={'date': 'ds', 'value': 'y'}, inplace=True)
        
        # Initialize and fit the model
        model = Prophet(daily_seasonality=True, yearly_seasonality=False, weekly_seasonality=False)
        model.fit(df)
        
        # Create future dataframe
        future = model.make_future_dataframe(periods=periods)
        
        # Predict
        forecast = model.predict(future)
        
        # Extract the relevant future predictions (the tail)
        future_forecast = forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].tail(periods)
        
        # Convert to list of dicts
        result = []
        for index, row in future_forecast.iterrows():
            result.append({
                "date": row['ds'].strftime('%Y-%m-%d'),
                "prediction": round(row['yhat'], 2),
                "lower_bound": round(row['yhat_lower'], 2),
                "upper_bound": round(row['yhat_upper'], 2)
            })
            
        print(json.dumps({"success": True, "forecast": result}))
        
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)

if __name__ == "__main__":
    main()
