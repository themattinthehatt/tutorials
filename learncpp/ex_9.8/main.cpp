#include <iostream>
#include <string>
#include <vector>

struct StudentGrade
{
    std::string name;
    char grade;
};

class GradeMap
{
private:
    std::vector<StudentGrade> map;

public:
    GradeMap()
    {
    }

    char& operator[](const std::string &input);

};

char& GradeMap::operator[](const std::string &input)
{
    for (auto &student : map)
    {
        if (input == student.name)
            return student.grade;
    }

    // if student not found, add to list
    StudentGrade temp {input, ' '};
    map.push_back(temp);
    return map.back().grade;
}

int main()
{
    GradeMap grades;
    grades["Joe"] = 'A';
    grades["Frank"] = 'B';
    std::cout << "Joe has a grade of " << grades["Joe"] << '\n';
    std::cout << "Frank has a grade of " << grades["Frank"] << '\n';
    return 0;
}
