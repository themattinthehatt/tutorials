#ifndef POINT2D_H
#define POINT2D_H

class Point2d
{
private:
    double x;
    double y;

public:
    Point2d(double x_=0.0, double y_=0.0);
    void print();
    friend double distanceFrom(const Point2d &point1, const Point2d &point2);
};

#endif // POINT2D_H
