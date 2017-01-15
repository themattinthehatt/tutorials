def number_outputter(start, end, increment):

    i = start
    numbers = []

    while i < end:
        print "At the top i is %d" % i
        numbers.append(i)
        
        i = i + increment
        print "Numbers now: ", numbers
        print "At the bottom i is %d" % i
        
        
    print "The numbers: "

    for num in numbers:
        print num
        
number_outputter(2, 12, 2)
