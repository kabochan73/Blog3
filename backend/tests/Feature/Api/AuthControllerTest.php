<?php

use App\Models\User;
use Laravel\Sanctum\PersonalAccessToken;

describe('login', function () {
    it('returns a token and persists it when credentials are valid', function () {
        $user = User::factory()->create(['password' => 'correct-password']);

        $response = $this->postJson('/api/login', [
            'email' => $user->email,
            'password' => 'correct-password',
        ]);

        $response->assertOk()->assertJsonStructure(['token']);

        $token = $response->json('token');
        $accessToken = PersonalAccessToken::findToken($token);

        expect($accessToken)->not->toBeNull();
        expect($accessToken->tokenable->is($user))->toBeTrue();
    });

    it('returns 401 when the password is incorrect', function () {
        $user = User::factory()->create(['password' => 'correct-password']);

        $response = $this->postJson('/api/login', [
            'email' => $user->email,
            'password' => 'wrong-password',
        ]);

        $response->assertStatus(401)->assertJson(['message' => 'The provided credentials are incorrect.']);
    });

    it('returns 401 when the email is unknown', function () {
        $response = $this->postJson('/api/login', [
            'email' => 'unknown@example.com',
            'password' => 'whatever-password',
        ]);

        $response->assertStatus(401)->assertJson(['message' => 'The provided credentials are incorrect.']);
    });

    it('returns 422 when required fields are missing', function () {
        $response = $this->postJson('/api/login', []);

        $response->assertStatus(422)->assertJsonValidationErrors(['email', 'password']);
    });
});

describe('logout', function () {
    it('revokes the current access token', function () {
        $user = User::factory()->create();
        $token = $user->createToken('admin');

        $response = $this->withHeader('Authorization', "Bearer {$token->plainTextToken}")
            ->postJson('/api/logout');

        $response->assertNoContent();
        expect(PersonalAccessToken::find($token->accessToken->id))->toBeNull();
    });

    it('returns 401 when no token is provided', function () {
        $response = $this->postJson('/api/logout');

        $response->assertStatus(401);
    });
});
