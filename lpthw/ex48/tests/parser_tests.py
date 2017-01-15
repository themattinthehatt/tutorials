from nose.tools import *
from ex48 import parser

def test_subject():
    # stops ok before subject (noun, or 'player' implicit when verb starts)
    assert_equal(
        parser.parse_subject([('stop', 'a'), ('noun', 'bear')]),
        ('noun', 'bear'))
    assert_equal(
        parser.parse_subject([('stop', 'to'), ('verb', 'go')]),
        ('noun', 'player'))
    # no directions before subject 
    assert_raises(
        Exception,
        parser.parse_subject,
        [('direction', 'east'), ('noun', 'bear')])
    assert_raises(
        Exception,
        parser.parse_subject,
        [('direction', 'east'), ('verb', 'go')])        
    # no numbers before subject
    assert_raises(
        Exception,
        parser.parse_subject,
        [('number', 34), ('noun', 'bear')])
    assert_raises(
        Exception,
        parser.parse_subject,
        [('number', 34), ('verb', 'go')])
    # no errors before subject
    assert_raises(
        Exception,
        parser.parse_subject,
        [('error', 'kitten'), ('noun', 'bear')])
    assert_raises(
        Exception,
        parser.parse_subject,
        [('error', 'kitten'), ('verb', 'go')])        
                
def test_verb():
    # stops ok before verbs
    assert_equal(
        parser.parse_verb([('stop', 'a'), ('verb', 'eat'), ('error', 'fish')]),
        ('verb', 'eat')) 
    # no directions before verbs
    assert_raises(
        Exception,
        parser.parse_verb,
        [('stop', 'a'), ('direction', 'north'), ('verb', 'go')])
    # no nouns before verbs
    assert_raises(
        Exception,
        parser.parse_verb,
        [('stop', 'a'), ('noun', 'bear'), ('verb', 'go')])
    # no numbers before verbs
    assert_raises(
        Exception,
        parser.parse_verb,
        [('number', 345), ('verb', 'go')])
    # no errors before verbs
    assert_raises(
        Exception,
        parser.parse_verb,
        [('error', 'kitten'), ('verb', 'go')])

def test_object():
    # stops ok before noun/direction
    assert_equal(
        parser.parse_object([('stop', 'a'), ('direction', 'north')]),
        ('direction', 'north'))         
    assert_equal(
        parser.parse_object([('stop', 'a'), ('noun', 'bear')]),
        ('noun', 'bear')) 
    # no verbs before noun/direction
    assert_raises(
        Exception,
        parser.parse_object,
        [('verb', 'run'), ('direction', 'north')])
    assert_raises(
        Exception,
        parser.parse_object,
        [('verb', 'run'), ('noun', 'bear')])
    # no numbers before noun/direction
    assert_raises(
        Exception,
        parser.parse_object,
        [('number', 5), ('noun', 'bear')])
    assert_raises(
        Exception,
        parser.parse_object,
        [('number', 5), ('direction', 'north')])
    # no errors before noun/direction
    assert_raises(
        Exception,
        parser.parse_object,
        [('error', 'kitten'), ('direction', 'north')])
    assert_raises(
        Exception,
        parser.parse_object,
        [('error', 'kitten'), ('noun', 'bear')])        

