@if(Session::has('error'))
    <div class="alert alert-danger">
        {{ Session::get('error') }}
    </div>
@endif

<form action="{{ url('login') }}" method="post">
    @csrf
    <input type="text" name="login" placeholder="Login">
    <input type="password" name="password" placeholder="Password">
    <button type="submit">Login</button>
</form>