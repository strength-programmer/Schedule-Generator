from fpdf import FPDF
import json
import sys
import traceback

def main():
    try:
        if len(sys.argv) < 2:
            raise ValueError("No schedule data provided")
            
        schedule_data = json.loads(sys.argv[1])
        sys.stderr.write(f"Received data: {json.dumps(schedule_data, indent=2)}\n")
        
        pdf = FPDF()
        pdf.add_page()
        
        # Set title
        pdf.set_font('Arial', 'B', 24)
        pdf.cell(0, 20, schedule_data['title'], 0, 1, 'C')
        
        # Add activities by day
        days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        
        for day in days:
            activities = [a for a in schedule_data['activities'] if day in a['days']]
            if activities:
                pdf.set_font('Arial', 'B', 16)
                pdf.cell(0, 10, day, 0, 1, 'L')
                
                # Sort activities by start time
                activities.sort(key=lambda x: x['startTime'])
                
                for activity in activities:
                    pdf.set_font('Arial', '', 12)
                    pdf.cell(0, 8, f"- {activity['name']} ({activity['category']})", 0, 1)
                    pdf.cell(0, 8, f"  {activity['startTime']} - {activity['endTime']}", 0, 1)
                pdf.ln(5)
        
        pdf_output = pdf.output(dest='S').encode('latin-1')
        sys.stdout.buffer.write(pdf_output)
        sys.stderr.write(f"Generated PDF size: {len(pdf_output)} bytes\n")
        
    except Exception as e:
        sys.stderr.write(f"Error: {str(e)}\n")
        sys.stderr.write(traceback.format_exc())
        sys.exit(1)

if __name__ == "__main__":
    main() 