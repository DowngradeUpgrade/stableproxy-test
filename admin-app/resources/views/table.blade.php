<?php 

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use GuzzleHttp\Client;

$client = new Client();
$response = $client->request('POST', 'http://localhost:5000/api/products/getForReview');
$tables = json_decode($response->getBody()->getContents());

?>

<table>
    <thead>
        <tr>
            <th>id</th>
            <th>name</th>
            <th>price</th>
            <th>action</th>
        </tr>
    </thead>
    <tbody>
        @foreach ($tables as $table)
            <tr id={{ $table->id }}>
                <td>{{ $table->id }}</td>
                <td>{{ $table->name }}</td>
                <td>{{ $table->price }}</td>
                <td>
                    <form action="{{ url('add-product') }}" method="post">
                        @csrf
                        <input type="text" name="newPrice" placeholder="New price">
                        <input type="hidden" name="id" value={{ $table->id }}>

                        <input type="submit" name="accept" value="Accept">
                        <input type="submit" name="decline" value="Decline">
                    </form>
                </td>
            </tr>
        @endforeach
    </tbody>
</table>