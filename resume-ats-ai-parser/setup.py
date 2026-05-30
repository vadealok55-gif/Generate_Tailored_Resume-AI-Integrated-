from setuptools import setup, find_packages

setup(
    name="resume-ats-ai-parser",
    version="1.0.0",
    author="Your Name",
    description="Advanced Resume ATS Parser with AI Models",
    packages=find_packages(),
    python_requires=">=3.11",
    install_requires=[
        "fastapi>=0.104.1",
        "torch>=2.1.0",
        "transformers>=4.35.0",
        "sentence-transformers>=2.2.2",
    ],
)
