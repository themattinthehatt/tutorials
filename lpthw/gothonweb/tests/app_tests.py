from nose.tools import *
from bin.app import app
from tests.tools import assert_response

def test_index():
    # check that we get a 404 on the / URL
    # resp = app.request("/")
    # assert_response(resp, status="404")
    
    resp = app.request("/")
    assert_response(resp, status="303")
    
    # test our first GET request to /game
    resp = app.request("/game")
    assert_response(resp)    
    
    # test that we get expected values
    data = {'room': 'shoot!'}
    resp = app.request("/game", method="POST", data=data)
    assert_response(resp, status="303")
