<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use function PHPSTORM_META\type;

class ProductsController extends Controller
{
    public function addProduct(Request $request)
    {
        try {
            $client = new \GuzzleHttp\Client();

            if ($request->accept) {

                if ((float)$request->newPrice <= 0) {
                    return redirect()->back()->with('error', 'Invalid data');
                }

                $response = $client->request('POST', 'http://localhost:5000/api/products/transferToMain', [
                    'json' => [
                        'products' => array(
                            array(
                                'id' => $request->id,
                                'new_price' => $request->newPrice,
                            )
                        )
                    ]
                ]);

                $response = json_decode($response->getBody()->getContents());

                if ($response == "ok") {
                    return redirect('/admin');
                } else {
                    return redirect()->back()->with('error', 'Invalid data');
                }
            }
            else {
                $response = $client->request('POST', 'http://localhost:5000/api/products/deleteFromReview', [
                    'json' => [
                        'products' => array(
                            array(
                                'id' => $request->id,
                            )
                        )
                    ]
                ]);

                $response = json_decode($response->getBody()->getContents());

                if ($response == "ok") {
                    return redirect('/admin');
                } else {
                    return redirect()->back()->with('error', 'Invalid data');
                }
            }
        } catch (\GuzzleHttp\Exception\BadResponseException $e) {
            if ($e->getCode() != 201) {
                return redirect()->back()->with('error', $e);
            }
        }
    }
}
