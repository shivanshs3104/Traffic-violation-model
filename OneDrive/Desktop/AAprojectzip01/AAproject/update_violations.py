import json
import os
from datetime import datetime

# Path to violations report
violations_file = r"c:\Users\shiva\OneDrive\Desktop\AAprojectzip01\AAproject\traffic-signal-violation-detection\result\violations_report (1).json"

# Fine amounts (in currency units)
FINE_AMOUNTS = {
    'no_helmet': 500,
    'triple_riding': 300,
    'no_number_plate': 1000
}

def update_violations_data():
    """Remove red_light violations and add fine information"""
    try:
        with open(violations_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        updated_data = []
        fine_id = 1001
        
        for violation in data:
            # Remove red_light from violations
            if 'violations' in violation:
                violations = violation['violations']
                if 'red_light' in violations:
                    del violations['red_light']
            
            # Remove red_light_on field
            if 'red_light_on' in violation:
                del violation['red_light_on']
            
            # Calculate total fines for this violation
            total_fine = 0
            fines_list = []
            
            if 'violations' in violation:
                for violation_type, items in violation['violations'].items():
                    if isinstance(items, list) and len(items) > 0:
                        if violation_type in FINE_AMOUNTS:
                            fine_per_item = FINE_AMOUNTS[violation_type]
                            for i, item in enumerate(items):
                                fine_amount = fine_per_item
                                total_fine += fine_amount
                                fines_list.append({
                                    'fine_id': fine_id,
                                    'violation_type': violation_type,
                                    'amount': fine_amount,
                                    'status': 'pending',  # pending or paid
                                    'issued_date': violation.get('timestamp', ''),
                                    'paid_date': None,
                                    'payment_method': None,
                                    'remarks': ''
                                })
                                fine_id += 1
            
            # Add fines information to violation
            violation['fines'] = {
                'total_fines': total_fine,
                'fines_list': fines_list,
                'paid_fines': 0,
                'pending_fines': total_fine
            }
            
            updated_data.append(violation)
        
        # Write updated data back
        with open(violations_file, 'w', encoding='utf-8') as f:
            json.dump(updated_data, f, indent=2, ensure_ascii=False)
        
        print(f"✅ Successfully updated {len(updated_data)} violations")
        print(f"✅ Removed 'red_light' violations from all records")
        print(f"✅ Added fine information to all violations")
        print(f"✅ Total fines generated: {len([f for v in updated_data for f in v.get('fines', {}).get('fines_list', [])])}")
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")

if __name__ == '__main__':
    update_violations_data()
