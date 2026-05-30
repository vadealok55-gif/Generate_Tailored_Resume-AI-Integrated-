#!/usr/bin/env python
import sys
from pathlib import Path

# Bootstrap project root into sys.path to prevent ModuleNotFoundError
sys.path.append(str(Path(__file__).resolve().parent.parent))

import argparse
import json
from src.ml.pipelines.extraction_pipeline import ExtractionPipeline

def main():
    parser = argparse.ArgumentParser(description="Resume ATS Parser")
    parser.add_argument("input_file", type=str, help="Path to resume file")
    parser.add_argument("-o", "--output", type=str, help="Output file path")
    args = parser.parse_args()
    
    input_file = Path(args.input_file)
    if not input_file.exists():
        print(f"File not found: {input_file}")
        return 1
    
    pipeline = ExtractionPipeline()
    resume = pipeline.process(str(input_file))
    
    output_data = {"status": "success", "data": resume.to_dict()}
    
    if args.output:
        with open(args.output, "w") as f:
            json.dump(output_data, f, indent=2, default=str)
        print(f"Results saved to: {args.output}")
    else:
        print(json.dumps(output_data, indent=2, default=str))
    
    return 0

if __name__ == "__main__":
    exit(main())
