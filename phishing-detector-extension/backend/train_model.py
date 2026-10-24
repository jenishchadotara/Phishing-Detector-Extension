import joblib
import numpy as np
from sklearn.ensemble import RandomForestClassifier

# Sample Training Data (Features: [length, has_ip, num_at, num_hyphen, num_dots, is_https])
X_train = np.array([
    [15, 0, 0, 0, 1, 1], # safe: google.com
    [22, 0, 0, 0, 2, 1], # safe: github.com/user
    [85, 1, 1, 4, 5, 0], # phishing: http://192.168.1.1@fake-bank-login.com/secure
    [90, 0, 2, 3, 4, 0], # phishing: http://verify-account-update-paypal.com
    [18, 0, 0, 0, 1, 1], # safe: wikipedia.org
    [110, 1, 1, 5, 6, 0] # phishing
])

# Labels: 0 = Safe, 1 = Phishing
y_train = np.array([0, 0, 1, 1, 0, 1])

model = RandomForestClassifier(n_estimators=10, random_state=42)
model.fit(X_train, y_train)

# Save the trained model
joblib.dump(model, 'phishing_model.pkl')
print("✅ Real ML Model ('phishing_model.pkl') Successfully Created!")