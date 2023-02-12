<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    @if (Session::has('error'))
        <div class="alert alert-danger">
            {{ Session::get('error') }}
        </div>
    @endif

    @if (Cookie::get('token'))
        <form action="{{ url('logout') }}" method="GET">
            @csrf
            <button type="submit">Logout</button>
        </form>

        @include('table')
    @else
        @include('login')
    @endif

    <script src="{{ mix('js/app.js') }}"></script>
</body>
</html>