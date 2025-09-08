import streamlit as st
import google.generativeai as genai
from PIL import Image
import io

# Configure Gemini API
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Choose models
text_model = genai.GenerativeModel("gemini-2.5-pro")
vision_model = genai.GenerativeModel("gemini-2.5-flash")

st.title("AI Cooking Recipe Recommender")

st.write("Get recipes from your ingredients, either by typing them or snapping a fridge photo!")

# --- Option 1: Manual Input ---
st.subheader("Option 1: Enter ingredients manually")
manual_ingredients = st.text_area("Enter ingredients (comma separated):")

if st.button("Generate Recipe from Ingredients"):
    if manual_ingredients.strip():
        prompt = f"Create a detailed recipe using only these ingredients: {manual_ingredients}. Include steps and serving size."
        response = text_model.generate_content(prompt)
        st.markdown("### Recipe Suggestion:")
        st.write(response.text)
    else:
        st.warning("Please enter some ingredients!")

# --- Option 2: Upload Fridge Image ---
st.subheader("Option 2: Upload a fridge image")
uploaded_file = st.file_uploader("Upload a picture of your fridge", type=["jpg", "jpeg", "png"])

if uploaded_file and st.button("Generate Recipe from Image"):
    image = Image.open(uploaded_file)

    # Show uploaded image
    st.image(image, caption="Uploaded fridge", use_column_width=True)

    # Ask Gemini Vision to analyze ingredients
    response = vision_model.generate_content(
        ["List all visible ingredients in this fridge and then suggest a creative recipe with them."],
        image
    )

    st.markdown("### Recipe Suggestion:")
    st.write(response.text) 
