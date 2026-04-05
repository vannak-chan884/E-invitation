export function useGoogleCalendar() {
    const addToGoogleCalendar = () => {
        const eventTitle = "កម្មវិធីមង្គលការរបស់ វណ្ណៈ & ស្រីណយ!";
        const eventDetails = "ប្រព្រឹត្តទៅនៅ ថ្ងៃសៅរ៍ ទី១៥ ខែមីនា ឆ្នាំ២០២៥ ត្រូវនឹង ថ្ងៃ២រោច ខែផល្គុន ឆ្នាំរោង ឆស័ក ពុទ្ធសករាជ ២៥៦៨ វេលាម៉ោង ៥:០០នាទីល្ងាច នៅ គេហដ្ឋានខាងស្រី ស្ថិតនៅ ភូមិកសិករ ឃុំសំឡាញ ស្រុកអង្គជ័យ ខេត្តកំពត!";
        const location = "https://maps.google.com/maps?q=10.865470,104.590876&ll=10.865470,104.590876&z=16"; 

        // Format date for Google Calendar (YYYYMMDDTHHMMSS)
        const startDate = "20250314T140000"; // March 14, 2025, 2:00 PM
        const endDate = "20250315T233000";   // March 15, 2025, 11:30 PM

        const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventTitle)}&dates=${startDate}/${endDate}&details=${encodeURIComponent(eventDetails)}&location=${encodeURIComponent(location)}&sf=true&output=xml`;

        window.open(googleCalendarUrl, "_blank");
    };

    return { addToGoogleCalendar };
}
