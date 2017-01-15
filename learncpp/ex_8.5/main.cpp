#include <string>
#include <iostream>

class Ball
{
private:
    int m_color;
    double m_radius;
    const int test_var = 12;

public:
    Ball(const int &color=12, double radius=10.0)
    {
        m_color = color;
        m_radius = radius;
    }

    void print()
    {
        std::cout << "color: " << m_color
                  << ", radius: " << m_radius
                  << ", test_var: " << test_var << '\n';
    }
};

void ballTest(int &color)
{
    int m_color = color;
}

int main()
{
//    Ball def;
//    def.print();

    int temp = 34;
    Ball blue(temp);
    blue.print();


    Ball green(34);
    green.print();


    int color_change = 17;

    Ball pink(color_change);
    ballTest(color_change);
    pink.print();

    color_change = 21;
    pink.print();

    return 0;
}
