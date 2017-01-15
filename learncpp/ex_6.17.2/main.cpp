#include <iostream>
#include <string>
#include <utility>

struct Student
{
    std::string name;
    int grade;
};

int main()
{

    int num_students;
    std::cout << "How many students?" << std::endl;
    std::cin >> num_students;

    Student *students = new Student[num_students];

    // get grades/names
    for (int indx = 0; indx < num_students; indx++)
    {
        std::cout << "Enter student's name: ";
        std::cin >> students[indx].name;
        std::cout << "Enter student's grade: ";
        std::cin >> students[indx].grade;
        std::cout << "\n";
    }

    // sort grades/names
    int max_indx = 0;
    for (int i = 0; i < num_students-1; i++)
    {
        max_indx = i;

        for (int j = i+1; j < num_students; j++)
        {
            if (students[j].grade > students[max_indx].grade)
                max_indx = j;
        }
        std::swap(students[i], students[max_indx]);
    }

    // print grades/names
    for (int indx = 0; indx < num_students; indx++)
    {
        std::cout << students[indx].name << " got a grade of "
                  << students[indx].grade << std::endl;
    }

    // deallocate
    delete[] students;

    return 0;
}
