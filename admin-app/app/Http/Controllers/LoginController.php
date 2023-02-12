<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class LoginController extends Controller
{
    public function login(Request $request)
    {
        try {
            $client = new \GuzzleHttp\Client();
            $response = $client->request('POST', 'http://localhost:5000/api/users/login', [
                'json' => [
                    'login' => $request->login,
                    'password' => $request->password
                ]
            ]);

            $response = json_decode($response->getBody()->getContents());

            if ($response->token) {

                // set token to cookie and redirect to admin page
                $cookie = cookie('token', $response->token, 60 * 24);
                return redirect('/admin')->withCookie($cookie);
            } else {
                return redirect()->back()->with('error', 'Invalid login or password');
            }
        } catch (\GuzzleHttp\Exception\BadResponseException $e) {
            if ($e->getCode() != 201) {
                return redirect()->back()->with('error', 'Invalid login or password');
            }
        }
    }
}
