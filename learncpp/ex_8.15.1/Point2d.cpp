#include <iostream>
#include <cmath>        // for sqrt
#include "Point2d.h"

Point2d::Point2d(double x_, double y_)
{
    x = x_;
    y = y_;
}

void Point2d::print()
{
    std::cout << "Point2d(" << x << ", " << y << ")" << std::endl;
}

double distanceFrom(const Point2d &point1, const Point2d &point2)
{
    return sqrt((point1.x - point2.x)*(point1.x - point2.x) + (point1.y - point2.y)*(point1.y - point2.y));
}
