#ifndef DATE_H
#define DATE_H

class Date
{
private:
    int m_year = 2000;
    int m_month = 1;
    int m_day = 1;

public:
    Date(int year, int month, int day);

    void setDate(int year, int month, int day);

    int getYear() { return m_year; }
    int getMonth() { return m_month; }
    int getDay() { return m_day; }
};

#endif
